import {Visitor} from './visitor.model';

export interface Visit {
  ID?: string;
  date?: string;
  additional_info?: string;
  needs_parking_space?: boolean;
  user?: string;
  visitor?: Visitor;
  supervisor?: Supervisor;
  has_accepted?: boolean;
}

export interface Supervisor {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
}
