const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

const AcademicTerm = require("./models/AcademicTerm");
const AcademicYear = require("./models/AcademicYear");
const Admin = require("./models/Admin");
const ClassLevel = require("./models/ClassLevel");
const Exam = require("./models/Exam");
const ExamResult = require("./models/ExamResults");
const Program = require("./models/Program");
const Question = require("./models/Questions");
const Student = require("./models/Student");
const Subject = require("./models/Subject");
const Teacher = require("./models/Teacher");
const YearGroup = require("./models/YearGroup");

const seedPassword = "Password123!";

async function main() {
  await mongoose.connect(process.env.DB_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

  const adminDocs = await Admin.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Admin ${i + 1}`,
      email: `admin${i + 1}@school.test`,
      password: seedPassword,
      role: "admin",
    }))
  );

  const adminIds = adminDocs.map(admin => admin._id);

  const academicTermDocs = await AcademicTerm.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Academic Term ${i + 1}`,
      description: `Academic term ${i + 1} for the school year with lectures, assignments, and assessments.`,
      duration: "3 months",
      createdBy: adminIds[i % adminIds.length],
    }))
  );
  const academicTermIds = academicTermDocs.map(term => term._id);

  const academicYearDocs = await AcademicYear.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Academic Year ${2024 + i}`,
      fromYear: new Date(2024 + i, 8, 1),
      toYear: new Date(2025 + i, 7, 31),
      isCurrent: i === 0,
      createdBy: adminIds[i % adminIds.length],
      students: [],
      teachers: [],
    }))
  );
  const academicYearIds = academicYearDocs.map(year => year._id);

  const classLevelDocs = await ClassLevel.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Level ${i + 1}00`,
      description: `Class Level ${i + 1}00 for school-year academic grouping.`,
      createdBy: adminIds[i % adminIds.length],
      students: [],
      subjects: [],
      teachers: [],
    }))
  );
  const classLevelIds = classLevelDocs.map(level => level._id);

  const programDocs = await Program.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Program ${i + 1}`,
      description: `Program ${i + 1} offers a specialized academic pathway and practical learning experience.`,
      duration: `${i + 3} years`,
      createdBy: adminIds[i % adminIds.length],
      teachers: [],
      students: [],
      subjects: [],
    }))
  );
  const programIds = programDocs.map(program => program._id);

  const subjectDocs = await Subject.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Subject ${i + 1}`,
      description: `Subject ${i + 1} explores core concepts and practical application relevant to the program.`,
      academicTerm: academicTermIds[i % academicTermIds.length],
      createdBy: adminIds[i % adminIds.length],
      duration: "3 months",
    }))
  );
  const subjectIds = subjectDocs.map(subject => subject._id);

  const teacherDocs = await Teacher.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@school.test`,
      password: seedPassword,
      dateEmployed: new Date(2020 + i, 0, 10),
      isWitdrawn: false,
      isSuspended: false,
      role: "teacher",
      applicationStatus: "approved",
      program: programDocs[i % programDocs.length].name,
      classLevel: classLevelDocs[i % classLevelDocs.length].name,
      academicYear: academicYearDocs[i % academicYearDocs.length].name,
      academicTerm: academicTermDocs[i % academicTermDocs.length].name,
      createdBy: adminIds[i % adminIds.length],
    }))
  );
  const teacherIds = teacherDocs.map(teacher => teacher._id);

  await Promise.all(
    subjectDocs.map((subject, index) =>
      Subject.findByIdAndUpdate(subject._id, {
        teacher: teacherIds[index],
      })
    )
  );

  await Promise.all(
    classLevelDocs.map((level, index) =>
      ClassLevel.findByIdAndUpdate(level._id, {
        students: [teacherIds[index]],
        subjects: [subjectIds[index]],
        teachers: [teacherIds[index]],
      })
    )
  );

  const studentDocs = await Student.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@school.test`,
      password: seedPassword,
      role: "student",
      classLevels: [classLevelIds[i % classLevelIds.length]],
      currentClassLevel: classLevelIds[i % classLevelIds.length].toString(),
      academicYear: academicYearIds[i % academicYearIds.length],
      dateAdmitted: new Date(2024 + i, 0, 15),
      program: programIds[i % programIds.length],
      isPromotedToLevel200: i % 2 === 0,
      isPromotedToLevel300: i % 3 === 0,
      isPromotedToLevel400: i % 4 === 0,
      isGraduated: false,
      isWithdrawn: false,
      isSuspended: false,
      prefectName: `Prefect ${i + 1}`,
      yearGraduated: `202${(i % 5) + 4}`,
    }))
  );
  const studentIds = studentDocs.map(student => student._id);
  const studentIdStrings = studentDocs.map(student => student.studentId);

  await Promise.all(
    programDocs.map((program, index) =>
      Program.findByIdAndUpdate(program._id, {
        teachers: [teacherIds[index]],
        students: [studentIds[index]],
        subjects: [subjectIds[index]],
      })
    )
  );

  const yearGroupDocs = await YearGroup.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Year Group ${i + 1}`,
      createdBy: adminIds[i % adminIds.length],
      academicYear: academicYearIds[i % academicYearIds.length],
    }))
  );

  const questionDocs = await Question.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      question: `What is the correct answer for Question ${i + 1}?`,
      optionA: `Option A for Q${i + 1}`,
      optionB: `Option B for Q${i + 1}`,
      optionC: `Option C for Q${i + 1}`,
      optionD: `Option D for Q${i + 1}`,
      correctAnswer: `Option B for Q${i + 1}`,
      isCorrect: true,
      createdBy: teacherIds[i % teacherIds.length],
    }))
  );

  const examDocs = await Exam.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Exam ${i + 1}`,
      description: `Examination ${i + 1} for ${subjectDocs[i % subjectDocs.length].name}.`,
      subject: subjectIds[i % subjectIds.length],
      program: programIds[i % programIds.length],
      passMark: 50,
      totalMark: 100,
      academicTerm: academicTermIds[i % academicTermIds.length],
      duration: "30 minutes",
      examDate: new Date(2025, i % 12, 10 + i),
      examTime: `${9 + (i % 4)}:00`,
      examType: i % 2 === 0 ? "Quiz" : "Midterm",
      examStatus: "pending",
      questions: [questionDocs[i % questionDocs.length]._id],
      classLevel: classLevelIds[i % classLevelIds.length],
      createdBy: teacherIds[i % teacherIds.length],
      academicYear: academicYearIds[i % academicYearIds.length],
    }))
  );
  const examIds = examDocs.map(exam => exam._id);

  const examResultDocs = await ExamResult.insertMany(
    Array.from({ length: 10 }, (_, i) => {
      const score = 45 + (i * 5) % 55;
      const passMark = 50;
      const status = score >= passMark ? "Pass" : "Fail";
      const remarks = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Poor";

      return {
        studentID: studentIdStrings[i % studentIdStrings.length],
        exam: examIds[i % examIds.length],
        grade: Math.min(score, 100),
        score,
        passMark,
        answeredQuestions: [
          { questionId: questionDocs[i % questionDocs.length]._id.toString(), answered: "Option B" },
        ],
        status,
        remarks,
        classLevel: classLevelIds[i % classLevelIds.length],
        academicTerm: academicTermIds[i % academicTermIds.length],
        academicYear: academicYearIds[i % academicYearIds.length],
        isPublished: i % 2 === 0,
      };
    })
  );

  await Promise.all(
    studentDocs.map((student, index) =>
      Student.findByIdAndUpdate(student._id, {
        examResults: [examResultDocs[index % examResultDocs.length]._id],
      })
    )
  );

  await Promise.all(
    academicYearDocs.map((year, index) =>
      AcademicYear.findByIdAndUpdate(year._id, {
        students: studentIds.slice(index, index + 1),
        teachers: [teacherIds[index]],
      })
    )
  );

  const results = {
    academicterms: academicTermDocs.length,
    academicyears: academicYearDocs.length,
    admins: adminDocs.length,
    Iconclasslevels: classLevelDocs.length,
    examresults: examResultDocs.length,
    exams: examDocs.length,
    programs: programDocs.length,
    questions: questionDocs.length,
    studentssubjects: subjectDocs.length,
    teachyeargroups: yearGroupDocs.length,
  };

  console.log("\nInserted records summary:");
  Object.entries(results).forEach(([key, value]) => {
    console.log(`${key} → ${value} records`);
  });

  await mongoose.disconnect();
  console.log("\nDatabase connection closed.");
}

main().catch(error => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
