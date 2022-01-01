const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team`;
  let result_players = await db.all(getPlayersQuery);
  response.send(result_players);
});

app.post("/players", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const postPlayerQuery = `
    INSERT INTO 
    cricket_team (player_id,player_name,jersey_number,role)
    VALUES
    (${player_name},${jersey_number},${role})
    `;
  await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId}`;
  let result_player = await db.get(getPlayerQuery);
  response.send(result_player);
});

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const putPlayerQuery = `
    UPDATE 
    cricket_team 
    SET
    player_name=${player_name},
    jersey_number=${jersey_number},
    role=${role}
   WHERE
   player_id=${playerId};
    `;
  await db.run(putPlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/" (request,response)=>{
    const playerId=request.params;
    const deletePlayerQuery=`
    DELETE FROM 
    cricket_team
    WHERE 
    player_id = ${playerId};
    `
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
})
module.exports = app;