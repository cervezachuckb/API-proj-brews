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
let perPage;
let typeBrew;
let city;
let variableOne;

app.post("/submit", async (req, res) => {
  console.log(req.body);
    page = 1;
    state = req.body.state;
    perPage = req.body.perPage;
    typeBrew = req.body.typeBrew;
    const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=" + perPage + "&by_type=" + typeBrew);
    // console.log(response);
    const result = response.data;
    console.log(result.length);
    res.render("brewList.ejs", { stateChoice: state, brewByState: result });
        // result.forEach((result) => {
        // result.name + ", " + result.address_1 + ", " + result.city;})
        // });
});

app.post("/testSubmit", async (req, res) => {
  console.log(req.body);
    page = 1;
    state = req.body.state;
    perPage = req.body.perPage;
    city = req.body.city;
    if (req.body.option = state) {
      variableOne = "?by_state=" + state;
    } else if (req.body.option = city) {
      variableOne = "?by_city=" + city;
    }
    const response = await axios.get(API_URL + variableOne + "&per_page=" + perPage);
    const result = response.data;
    if (req.body.option == state) {
      res.render("brewList.ejs", { stateChoice: state, brewByState: result });
    } else {
      res.render("brewCity.ejs", { stateChoice: city, brewByState: result });
    }
});

app.post("/submit3", async (req, res) => {
  console.log(req.body);
    page = 1;
    perPage = req.body.perPage;
    const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=" + perPage);
    // console.log(response);
    const result = response.data;
    res.render("brewList.ejs", { stateChoice: state, brewByState: result });
});

app.post("/submit4", async (req, res) => {
  console.log(req.body);
    page = 1;
    perPage = req.body.perPage;
    const response = await axios.get(API_URL + "?by_city=" + city + "&per_page=" + perPage);
    // console.log(response);
    const result = response.data;
    res.render("brewCity.ejs", { stateChoice: city, brewByState: result });
});

app.post("/submitCity", async (req, res) => {
  console.log(req.body);
    page = 1;
    city = req.body.city;
    perPage = req.body.perPage;
    const response = await axios.get(API_URL + "?by_city=" + city + "&per_page=" + perPage);
    // console.log(response);
    const result = response.data;
    res.render("brewCity.ejs", { stateChoice: city, brewByState: result });
});

// next page button here
  app.get("/butt", async (req, res) => {
    page++;
    // const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=" + perPage + "&page=" + page + "&by_type=" + typeBrew);
    const response = await axios.get(API_URL + variableOne + "&per_page=" + perPage + "&page=" + page);
    const result = response.data;
    console.log(result.length);
    console.log(variableOne);
    if (result.length == 0 && city == '') {
      res.render("brewList3.ejs", { brewList: state });
    } else if (result.length == 0 && state == '') {
      res.render("brewCity3.ejs", { brewList: city });
    } else if (result.length !== 0 && city == '') {
      res.render("brewList2.ejs", { stateChoice2: state, brewByState: result });
    } else if (result.length !== 0 && state == ''){
      res.render("brewCity2.ejs", { stateChoice2: city, brewByState: result });
    }
  });

  app.get("/butt2", async (req, res) => {
    page++;
    // const response = await axios.get(API_URL + "?by_city=" + city + "&per_page=" + perPage + "&page=" + page);
    const response = await axios.get(API_URL + variableOne + "&per_page=" + perPage + "&page=" + page);
    const result = response.data;
    console.log(result.length);
    console.log(page);
    if (result.length == 0) {
      res.render("brewCity3.ejs", { brewList: city });
    } else {
      res.render("brewCity2.ejs", { stateChoice2: city, brewByState: result });
    };
  });

  // previous page button here
  app.get("/submit2", async (req, res) => {
      page--;
      // const response = await axios.get(API_URL + "?by_state=" + state + "&per_page=" + perPage + "&page=" + page + "&by_type=" + typeBrew);
      const response = await axios.get(API_URL + variableOne + "&per_page=" + perPage + "&page=" + page);
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

  app.get("/submit2Minus", async (req, res) => {
    page--;
    const response = await axios.get(API_URL + "?by_city=" + city + "&per_page=" + perPage + "&page=" + page);
    const result = response.data;
    console.log(page);
    if (page === 1 || page <= 0) {
      res.render("brewCity.ejs", { stateChoice: city, brewByState: result });
    } else {
      res.render("brewCity2.ejs", { stateChoice2: city, brewByState: result });
    }
});

  // } catch(error) {
  //   if (result == []) {
  //     res.render("index.ejs", { oops: "End of brewery list." });
  //   }
  // };
  // });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});