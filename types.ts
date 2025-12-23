
export type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Other';
export type Importance = 'Not important' | 'Somewhat important' | 'Very important';

export interface QuestionnaireData {
  id: string;
  submittedAt: string;
  // I. BASICS
  fullName: string;
  email: string;
  age: string;
  gender: Gender | '';
  interestedIn: Gender[];

  // II. CULTURE & CONTEXT
  culturalBackground: string;
  culturalImportance: Importance | '';
  religion: string;
  religiousImportance: Importance | '';
  politicalIdentity: string;
  politicalImportance: Importance | '';

  // III. EDUCATION & PATH
  major: string;
  gradYear: string;
  careerDirection: string;
  careerOther: string;
  locationCommitted: 'Yes' | 'No' | 'Unsure' | '';
  locationDetail: string;

  // IV. AMBITION SIGNAL
  exceptionalTraits: string[];
  otherTrait: string;
  ambitionContext: string;
  resumeFileName: string;
  instagramHandle: string;
  linkedinHandle: string;

  // V. OPEN-ENDED
  lookingFor: string;
  idealPartner: string;
  firstDate: string;
  lifeContext: string;
  excitedToBuild: string;
  dealbreakers: string;

  // VI. COMMITMENT
  understandsOneMatch: boolean;
  willingToExplore: boolean;
}

export const INITIAL_DATA: QuestionnaireData = {
  id: '',
  submittedAt: '',
  fullName: '',
  email: '',
  age: '',
  gender: '',
  interestedIn: [],
  culturalBackground: '',
  culturalImportance: '',
  religion: '',
  religiousImportance: '',
  politicalIdentity: '',
  politicalImportance: '',
  major: '',
  gradYear: '',
  careerDirection: '',
  careerOther: '',
  locationCommitted: '',
  locationDetail: '',
  exceptionalTraits: [],
  otherTrait: '',
  ambitionContext: '',
  resumeFileName: '',
  instagramHandle: '',
  linkedinHandle: '',
  lookingFor: '',
  idealPartner: '',
  firstDate: '',
  lifeContext: '',
  excitedToBuild: '',
  dealbreakers: '',
  understandsOneMatch: false,
  willingToExplore: false,
};
