
export default interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: { name: string };
    location: { name: string };
    episode: string[];
    image: string;
    firstEpisodeName: string; 
  }
  
  