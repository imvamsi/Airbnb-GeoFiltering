import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class HouseInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  bedrooms!: number;
}

class House {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const urlParts = this.image.split("/");
    return urlParts[urlParts.length - 1];
  }

  @Field((_type) => Int)
  bedrooms!: number;
}
