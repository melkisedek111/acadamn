import { LucideIcon } from "lucide-react";

export const ROLES_OBJ = {
	ADMIN: "admin",
	STUDENT: "student",
};

export const DAYS = [
	{
		id: "monday",
		label: "Monday",
	},
	{
		id: "tuesday",
		label: "Tuesday",
	},
	{
		id: "wednesday",
		label: "Wednesday",
	},
	{
		id: "thursday",
		label: "Thursday",
	},
	{
		id: "friday",
		label: "Friday",
	},
	{
		id: "saturday",
		label: "Saturday",
	},
	{
		id: "sunday",
		label: "Sunday",
	},
] as const;

export const QUESTION_TYPE = {
	GENERAL_QUESTION: {
		label: "General Question",
		value: "GENERAL_QUESTION",
	},
	CODE_QUESTION: {
		label: "Code Question",
		value: "CODE_QUESTION",
	},
};

export const OPTION_TYPE = {
	SINGLE_CHOICE: {
		label: "Single Choice",
		value: "SINGLE_CHOICE",
	},
	MULTIPLE_CHOICE: {
		label: "Multiple Choice",
		value: "MULTIPLE_CHOICE",
	},
	TRUE_OR_FALSE: {
		label: "True or False",
		value: "TRUE_OR_FALSE",
	},
	FILL_IN_THE_BLANKS_OR_ENUMERATION: {
		label: "Fill in the Blanks or Enumeration",
		value: "FILL_IN_THE_BLANKS_OR_ENUMERATION",
	},
	EXPLANATION: {
		label: "Explanation",
		value: "EXPLANATION",
	},
};

export const CODE_LANGUAGES = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "python", label: "Python" },
	{ value: "java", label: "Java" },
	{ value: "csharp", label: "C#" },
	{ value: "cplusplus", label: "C++" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "php", label: "PHP" },
	{ value: "ruby", label: "Ruby" },
	{ value: "swift", label: "Swift" },
	{ value: "go", label: "Go" },
	{ value: "rust", label: "Rust" },
	{ value: "kotlin", label: "Kotlin" },
	{ value: "scala", label: "Scala" },
	{ value: "dart", label: "Dart" },
	{ value: "r", label: "R" },
	{ value: "perl", label: "Perl" },
	{ value: "html", label: "HTML" },
	{ value: "css", label: "CSS" },
	{ value: "sql", label: "SQL" },
];


export type TLinks = {
    title: string;
    link: string;
}

export enum LinkTitle {
    DASHBOARD = "dashboard",
    EXAMS = "exams",
    SUBJECTS = "subjects",
    MYSTUDENTS = "myStudents"
}

export type TLinkDetails<T = {}> = {
    [key in LinkTitle]: TLinks & T;
}

export const LinkDetails: TLinkDetails = {
    [LinkTitle.DASHBOARD]: {
        title: "Dashboard",
        link: "/dashboard",
    },
    [LinkTitle.EXAMS]: {
        title: "Exams",
        link: "/exams",
    },
    [LinkTitle.SUBJECTS]: {
        title: "Subjects",
        link: "/subjects",
    },
    [LinkTitle.MYSTUDENTS]: {
        title: "My Students",
        link: "/my-students",
    }
}