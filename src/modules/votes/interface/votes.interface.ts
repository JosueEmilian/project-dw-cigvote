export interface CandidateResult {
  candidateName:  string;
  totalVotes:     number;
}

export interface CampaignResult {
  campaignTitle:        string;
  campaignDescription:  string;
  candidates:           CandidateResult[];
}
