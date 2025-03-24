export interface GetAllContentBySectionId {
  sectionDetails: SectionDetails
  data: GetAllContentBySectionIdData[]
}

export interface SectionDetails {
  id: string
  name: string
  title: string
  description: string
  imagenUrl: string
  lang: string
  isPremium: boolean
}

export interface GetAllContentBySectionIdData {
  id: string
  sectionId: string
  contentId: string
  contentType: string
  order: number
  content: Content
}

export interface Content {
  id: string
  title: string
  section_name?: string
  description?: string
  posterUrl?: string
  videoUrl?: string
  section_id?: string
  lang: string
  isMandatory?: boolean
  sectionId?: string
  isPremium?: boolean
  questions?: Question[]
  content?: string
  createdAt?: string
  updatedAt?: string
  difficulty?: string
  language?: string
  codeTemplate?: string
  expectedSolution?: string
  cards?: Card[]
}

export interface Question {
  id: string
  quizId: string
  text: string
  options: string
}

export interface Card {
  id: string
  front: string
  back: string
  deckId: string
}
