import app from "./app.js";
import { dbConnection } from "./db/connection.js";

const PORT = process.env.PORT || 5000
// Connections and listeners
dbConnection()
.then(()=>{
  app.listen(PORT, () => 
    console.log("Server is listen && DataBase Connected")
  );
})
.catch((error)=>{
   console.log(error);
   
})