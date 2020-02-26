export const statsParams = {
  dex: {
    price: 20,
  },
  str: {
    price: 10,
  },
  int: {
    price: 20,
  },
  hlt: {
    price: 10,
  },
  fp: {
    price: 3,
    dep: 'hlt',
  },
  hp: {
    price: 2,
    dep: 'str',
  },
  will: {
    price: 5,
    dep: 'int',
  },
  per: {
    price: 5,
    dep: 'int',
  },
  bs: {
    type: 'movement',
    price: 5,
    step: 0.25,
  },
  bm: {
    type: 'movement',
    price: 5,
    step: 1,
  },
};

export const defaultChar = {
  name: 'Character name',
  points: {
    total: 200,
  },
  primaryStats: {
    dex: 10,
    fp: 10,
    hlt: 10,
    hp: 10,
    int: 10,
    per: 10,
    str: 10,
    will: 10,
    bs: null,
    bm: null,
  },
};

export interface Char {
  advantages: {

  };
  disadvantages: {

  };
  name: string;
  points: {
    total: number;
  };
  primaryStats: PrimaryStats;
  skills: number;
}

export interface PrimaryStats {
  dex: number;
  fp: number;
  hlt: number;
  hp: number;
  int: number;
  per: number;
  str: number;
  will: number;
  bs: number;
  bm: number;
}

export interface SkillDeps {
  name: string;
  modifier: number;
}

export interface ISkill {
  name: string;
  displayName: string;
  attr: 'str' | 'dex' | 'int' | 'will' | 'hlt' | 'per';
  complexity: 'E' | 'M' | 'H' | 'VH';
  deps?: SkillDeps[];
  desc?: string;
  value?: number;
  price?: number;
}

export class Char {
  constructor(data?: any) {
    Object.assign(this, data);
  }
}

export interface SecondaryParams {
  BasicLift: number; // (ST x ST)/5
  BasicSpeed: number; // (HT + DX)/4
}
