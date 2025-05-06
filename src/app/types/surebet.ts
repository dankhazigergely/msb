// Típusok surebet kalkulátorokhoz

export type StakeField2Way = 'stake1' | 'stake2' | 'total';
export type StakeField3Way = 'stake1' | 'stake2' | 'stake3' | 'total';
export type StakeField4Way = 'stake1' | 'stake2' | 'stake3' | 'stake4' | 'total';

export type AnyStakeField = StakeField2Way | StakeField3Way | StakeField4Way;
