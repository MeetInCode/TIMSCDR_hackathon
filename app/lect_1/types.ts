export interface VideoLecture {
  title: string;
  url: string;
  duration: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseModule {
  week: number;
  topic: string;
}

export interface CourseDetails {
  title: string;
  description: string;
  mentor: string;
  whatYouWillLearn: string[];
  courseContent: CourseModule[];
}

export interface Course {
  videoLecture: VideoLecture;
  aiQuiz: {
    questions: QuizQuestion[];
  };
  courseDetails: CourseDetails;
}