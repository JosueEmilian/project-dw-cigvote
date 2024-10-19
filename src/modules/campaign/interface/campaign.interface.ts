export interface ICampaign {
    id:         number;
    message:    string;
}

export interface CampaignList {
    id:              number;
    title:           string;
    description:     string;
    isVotingEnabled: boolean;
}