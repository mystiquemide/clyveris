export type ResearchSource = {
  publisher: string
  url: string
  publishedAt: string
  facts: string[]
}

export type ResearchDeliverable = {
  brief: string
  status: "covered" | "no_coverage"
  sources: ResearchSource[]
  editorialTake: string
  decisionQuestion: string
  tags: string[]
  generatedAt: string
}

export type JobStatus =
  | "requested"
  | "payment_required"
  | "paid"
  | "researching"
  | "delivered"
  | "failed"
  | "rejected"

export type ResearchBriefRequest = {
  topic: string
  tags?: string[]
  maxSources?: number
}

export type ResearchJob = {
  id: string
  negotiationId: string
  orderId?: string
  serviceId: string
  requesterAgentId: string
  brief: ResearchBriefRequest
  status: JobStatus
  price?: string
  paymentToken?: string
  payTxHash?: string
  deliverTxHash?: string
  result?: ResearchDeliverable
  failureReason?: string
  createdAt: string
  updatedAt: string
}
