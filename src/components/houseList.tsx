import Link from "next/link";
import { Image } from "cloudinary-react";
import { HousesQuery_houses } from "src/generated/HousesQuery";

interface HouseListProps {
  houses: HousesQuery_houses[];
  setHighlightedId: (id: string | null) => void;
}

export default function HouseList(props: HouseListProps) {
  console.log("🚀 ~ file: houseList.tsx ~ line 14 ~ HouseList ~ houses", props);

  function handleMouseEnter(item) {
    props.setHighlightedId(item);
  }

  function handleMouseLeave() {
    console.log();
  }

  return (
    <>
      {props.housesData?.map((house) => (
        <Link key={house.id} href={`/houses/${house.id}`}>
          <div
            className="px-6 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => handleMouseEnter(house.id)}
            onMouseLeave={() => handleMouseLeave()}
          >
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={house.publicId}
                alt={house.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{house.address}</h2>
              <p>{house.bedrooms} 🛌 house</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
