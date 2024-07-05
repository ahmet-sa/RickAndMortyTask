import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../axios.config";
import FilterComponent from "../components/FilterComponent";
import  Character  from "../constant"; 
const RickAndMortyPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [locations, setLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);

  const fetchCharacters = async (status: string = "All", gender: string = "All", species: string = "All", type: string = "All") => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (status !== "All") params.status = status;
      if (gender !== "All") params.gender = gender;
      if (species !== "All") params.species = species;
      if (type !== "All") params.type = type;

      const response = await axiosInstance.get("api/character", { params });

      if (response.status === 404) {
        setCharacters([]);
        setFilteredCharacters([]);
        setError("Characters not found.");
      } else {
        const charactersData: Character[] = await Promise.all(response.data.results.map(async (character: any) => {
          const episodeResponse = await axios.get(character.episode[0]);
          character.firstEpisodeName = episodeResponse.data.name;
          return character;
        }));
        setCharacters(charactersData);
        setFilteredCharacters(charactersData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get("api/location");
      setLocations(response.data.results);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchCharacters();
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchCharacters(selectedStatus, selectedGender, selectedSpecies, selectedType);
  }, [selectedStatus, selectedGender, selectedSpecies, selectedType]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchQuery, characters]);

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleGenderFilterChange = (value: string) => {
    setSelectedGender(value);
  };

  const handleSpeciesFilterChange = (value: string) => {
    setSelectedSpecies(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setSelectedType(value);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Alive", label: "Alive" },
    { value: "Dead", label: "Dead" },
    { value: "unknown", label: "Unknown" },
  ];

  const genderOptions = [
    { value: "All", label: "All" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "genderless", label: "Genderless" },
  ];

  const speciesOptions = [
    { value: "All", label: "All" },
    { value: "Human", label: "Human" },
    { value: "Alien", label: "Alien" },
  ];

  const typeOptions = [
    { value: "All", label: "All" },
    { value: "Human with ants in his eyes", label: "Human with ants in his eyes" },
    { value: "Superhuman (Ghost trains summoner)", label: "Superhuman (Ghost trains summoner)" },
  ];

  return (
    <div className="flex pr-100px rounded-10 max-h-200">
      <div className="w-300px pl-50px text-left mt-30px p-4 border-r border-gray-300 flex flex-col bg-white rounded-10 ">

        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 mt-4 border border-gray-300 rounded"
        />

        <FilterComponent
          title="Filter by Status"
          options={statusOptions}
          selectedOption={selectedStatus}
          onChange={handleStatusFilterChange}
        />

        <FilterComponent
          title="Filter by Gender"
          options={genderOptions}
          selectedOption={selectedGender}
          onChange={handleGenderFilterChange}
        />

        <FilterComponent
          title="Filter by Species"
          options={speciesOptions}
          selectedOption={selectedSpecies}
          onChange={handleSpeciesFilterChange}
        />

        <FilterComponent
          title="Filter by Type"
          options={typeOptions}
          selectedOption={selectedType}
          onChange={handleTypeFilterChange}
        />

      </div>

      <div className="flex-1 p-4 ">
        {loading ? (
          <p>Loading...</p>
        ) : filteredCharacters.length === 0 ? (
          <p>No characters found.</p>
        ) : (
          <ul>
            {filteredCharacters.map((character) => (
              <li className="flex w-full justify-between mb-4 bg-blue-2 rounded-2 " key={character.id}>
                <div className="h-50 flex justify-between p-2 w-full border-b border-gray-300 justify-center w-200px ">
                  <div className="flex flex-col pl-20px pt-20px">
                    <div className="text-black font-500 text-6 mr-10px">{character.name}</div>
                    <div className={`${character.status === "Alive" ? "text-green" : character.status === "Dead" ? "text-red" : "text-gray"} pa-1 `}>
                      {character.origin.name} - {character.species}
                    </div>
                    <div className="text-gray-500">Last known location:</div>
                    <div>{character.location.name}</div>
                    <div className="text-gray-500">First seen in:</div>
                    <div>{character.firstEpisodeName}</div>
                  </div>
                  <img className="h-50" src={character.image} alt={character.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RickAndMortyPage;
