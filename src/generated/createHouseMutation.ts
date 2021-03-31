/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HouseInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createHouseMutation
// ====================================================

export interface createHouseMutation_createHouse {
  __typename: "House";
  id: string;
}

export interface createHouseMutation {
  createHouse: createHouseMutation_createHouse | null;
}

export interface createHouseMutationVariables {
  input: HouseInput;
}
