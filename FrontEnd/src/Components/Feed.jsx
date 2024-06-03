import React, { useEffect } from "react";
import { Stack, Box, Typography } from "@mui/material";
import Videos from "./Videos";
import { useState } from "react";
import axios from "axios";
import SignInSide from "../Actions/SigInSide";
import SideBar from "./SideBar";
import { addFinalTime } from "../Redux/Deadline";
import { useDispatch, useSelector } from "react-redux";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [videos, setVideos] = useState(null);
  const { FinalTime, tempEndTime, running } = useSelector(
    (state) => state.deadline
  );
  const dispatch = useDispatch();
  let timer;

  const calculateTimeDifference = () => {
    const currentDate = new Date();
    const endTime = new Date(tempEndTime);
    const difference = endTime.getTime() - currentDate.getTime();
    console.log(difference);
    return difference > 0 ? difference : 0;
  };

  useEffect(() => {
    if (running) {
      timer = setInterval(() => {
        dispatch(addFinalTime(calculateTimeDifference()));
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [running, tempEndTime]);

  const formattedTime = (milliseconds) => {
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return `${days} days: ${hours} hours: ${minutes} minutes`;
  };

  const FetchVideos = async () => {
    const response = await axios.get("/videos/random");
    setVideos(response.data);
  };

  useEffect(() => {
    FetchVideos();
  }, [setSelectedCategory]);

  return (
    <div>
      <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
        <SideBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Box p={3} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#000", marginBottom: "5px" }}
          >
            {selectedCategory} <span style={{ color: "#1557a5" }}>videos</span>
          </Typography>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ color: "#000", marginBottom: "35px" }}
          >
            Remaining Time :{" "}
            <span style={{ color: "#1557a5" }}>{formattedTime(FinalTime)}</span>
          </Typography>

          <Videos videos={videos} direction="row" />
        </Box>
      </Stack>
    </div>
  );
};

export default Feed;
