/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HouseInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateHouseMutation
// ====================================================

export interface updateHouseMutation_updateHouse {
  __typename: "House";
  id: string;
  image: string;
  address: string;
  bedrooms: number;
  latitude: number;
  longitude: number;
  publicId: string;
}

export interface updateHouseMutation {
  updateHouse: updateHouseMutation_updateHouse | null;
}

export interface updateHouseMutationVariables {
  id: string;
  input: HouseInput;
}
