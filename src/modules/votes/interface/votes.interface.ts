export interface CandidateResult {
  candidateName:        string;
  candidateDescription: string;
  totalVotes:           number;
}

export interface CampaignResult {
  campaignTitle:        string;
  campaignDescription:  string;
  candidates:           CandidateResult[];
}