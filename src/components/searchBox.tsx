import { ChangeEvent } from "react";
import { FunctionComponent } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface SearchBoxProps {
    onSelectAddress: (address: string, latitude: number | null, longitude: number | null) => void
    defaultValue: string
}

const libraries: Libraries = ['places']

export function SearchBox({onSelectAddress, defaultValue}: SearchBoxProps) {
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    libraries
  })

  if(!isLoaded) return null
  if(loadError) return <div>Error loading</div>

  return (
    <ReadySearchBox onSelectAddress={onSelectAddress} defaultValue={defaultValue}/>
  )
}

function ReadySearchBox({onSelectAddress, defaultValue}: SearchBoxProps) {
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete({debounce: 300, defaultValue})

  function handleSelect() {}

  function handleChange() {}

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput id='search' value={value} onChange={handleChange}
        placeholder='Search for your location'
        className='w-full p-2'
      />
    </Combobox>
  )
}
