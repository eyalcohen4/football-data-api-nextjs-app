import axios from "axios"

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const BASE_URL = "https://api.football-data.org/v4"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-Auth-Token": API_KEY,
  },
})

export const getCompetitions = async () => {
  const response = await api.get("/competitions")
  return response.data?.competitions?.filter((c: any) => {
    return [
      "Premier League",
      "La Liga",
      "Bundesliga",
      "Serie A",
      "Ligue 1",
      "Primera Division",
    ].includes(c.name);
  });
}

export const getTeam = async (teamId: string) => {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
};

export const getTeamMatches = async (teamId: string) => {
  const response = await api.get(`/teams/${teamId}/matches`);
  return response.data;
};

export const getCompetition = async (competitionId: string) => {
  const response = await api.get(`/competitions/${competitionId}`);
  return response.data;
};


export const getFixtures = async (competitionId: string) => {
  const response = await api.get(`/competitions/${competitionId}/matches`)
  return response.data
}

export const getStandings = async (competitionId: string) => {
  const response = await api.get(`/competitions/${competitionId}/standings`)
  return response.data
}

