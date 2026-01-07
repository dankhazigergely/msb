// Típusok surebet kalkulátorokhoz

export type StakeField2Way = 'stake1' | 'stake2' | 'total';
export type StakeField3Way = 'stake1' | 'stake2' | 'stake3' | 'total';
export type StakeField4Way = 'stake1' | 'stake2' | 'stake3' | 'stake4' | 'total';
export type StakeField5Way = 'stake1' | 'stake2' | 'stake3' | 'stake4' | 'stake5' | 'total';
export type StakeField6Way = 'stake1' | 'stake2' | 'stake3' | 'stake4' | 'stake5' | 'stake6' | 'total';

export type AnyStakeField = StakeField2Way | StakeField3Way | StakeField4Way | StakeField5Way | StakeField6Way;
