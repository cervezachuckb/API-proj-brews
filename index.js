import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.openbrewerydb.org/v1/breweries";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { buttface: "Just waiting... muthafucka" });
    // } catch (error) {
    //   console.error("Failed to make request:", error.message);
    //   res.render("index.ejs", {
    //     error: error.message,
    //   });
    // }
  });

app.get("/random", async (req, res) => {
      const response = await axios.get(API_URL + "/random");
      const result = response.data;
      console.log(result);
        const brewName = result[0].name;
        const brewCity = result[0].city;
        const brewState = result[0].state;
      res.render("index.ejs", { buttface: brewName + ", " + brewCity + ", " + brewState });
    // } catch (error) {
    //   console.error("Failed to make request:", error.message);
    //   res.render("index.ejs", {
    //     error: error.message,
    //   });
    // }
  });

let state;
let page;

app.post("/submit", async (req, res) => {
  console.log(req.body);
    page = 1;
    state = req.body.state;
    const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=15");
    // console.log(response);
    const result = response.data;
    console.log(result.length);
    res.render("brewList.ejs", { stateChoice: state, brewByState: result });
        // result.forEach((result) => {
        // result.name + ", " + result.address_1 + ", " + result.city;})
        // });
});

// next page button here
  app.get("/butt", async (req, res) => {
    page++;
    const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=15&page=" + page);
    const result = response.data;
    console.log(result.length);
    console.log(page);
    if (result.length == 0) {
      res.render("brewList3.ejs", { brewList: state });
    } else {
      res.render("brewList2.ejs", { stateChoice2: state, brewByState: result });
    };
  });

  // previous page button here
  app.get("/submit2", async (req, res) => {
      page--;
      const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=15&page=" + page);
      const result = response.data;
      console.log(page);
      // if (result.length == 0) {
      //   res.render("index.ejs", { brewList: `You've come to the end of the list of breweries in ${state}. Select another state! 🍺 🍺 🍺` });
      // } else {
      if (page === 1 || page <= 0) {
        res.render("brewList.ejs", { stateChoice: state, brewByState: result });
      } else {
        res.render("brewList2.ejs", { stateChoice2: state, brewByState: result });
      }
  });

  // } catch(error) {
  //   if (result == []) {
  //     res.render("index.ejs", { oops: "End of brewery list." });
  //   }
  // };
  // });

// const btn = document.getElementById('test');
//     btn.addEventListener('click', function handleClick() {
//     btn.textContent = 'Button clicked';
//     });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});