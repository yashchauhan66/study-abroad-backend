const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

function calculateScore(student, program) {
  let score = 0;
  const reasons = [];

  if (student.targetCountries.includes(program.country)) {
    score += 35;
    reasons.push(`Preferred country match: ${program.country}`);
  }

  if (
    student.interestedFields.some((field) =>
      program.field.toLowerCase().includes(field.toLowerCase())
    )
  ) {
    score += 30;
    reasons.push(`Field alignment: ${program.field}`);
  }

  if (student.maxBudgetUsd >= program.tuitionFeeUsd) {
    score += 20;
    reasons.push("Within budget range");
  }

  if (student.preferredIntake && program.intakes.includes(student.preferredIntake)) {
    score += 10;
    reasons.push(`Preferred intake available: ${student.preferredIntake}`);
  }

  if ((student.englishTest?.score || 0) >= program.minimumIelts) {
    score += 5;
    reasons.push("English test score meets requirement");
  }

  return {
    score,
    reasons,
  };
}

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const { targetCountries, interestedFields, maxBudgetUsd, preferredIntake, englishTest } = student;
  const ieltsScore = englishTest?.score || 0;

  const recommendations = await Program.aggregate([
    {
      $addFields: {
        countryScore: {
          $cond: { if: { $in: ["$country", targetCountries || []] }, then: 35, else: 0 }
        },
        fieldScore: {
          $cond: {
            if: {
              $anyElementTrue: {
                $map: {
                  input: interestedFields || [],
                  as: "field",
                  in: { $regexMatch: { input: "$field", regex: "$$field", options: "i" } }
                }
              }
            },
            then: 30,
            else: 0
          }
        },
        budgetScore: {
          $cond: { if: { $lte: ["$tuitionFeeUsd", maxBudgetUsd || Infinity] }, then: 20, else: 0 }
        },
        intakeScore: {
          $cond: { if: { $in: [preferredIntake, "$intakes"] }, then: 10, else: 0 }
        },
        ieltsScoreVal: {
          $cond: { if: { $lte: ["$minimumIelts", ieltsScore] }, then: 5, else: 0 }
        }
      }
    },
    {
      $addFields: {
        matchScore: {
          $add: ["$countryScore", "$fieldScore", "$budgetScore", "$intakeScore", "$ieltsScoreVal"]
        }
      }
    },
    {
      $sort: { matchScore: -1, tuitionFeeUsd: 1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        countryScore: 0,
        fieldScore: 0,
        budgetScore: 0,
        intakeScore: 0,
        ieltsScoreVal: 0
      }
    }
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries,
        interestedFields,
      },
      recommendations,
    },
    meta: {
      implementationStatus: "mongodb-aggregation-implemented",
    },
  };
}


module.exports = {
  buildProgramRecommendations,
};
