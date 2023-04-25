import { Card, Typography } from "antd";

export function MatchScreen() {
  return (
    <Card style={{ height: "400px" }} bodyStyle={{ height: "100%" }}>
      <Typography>Match History</Typography>
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography style={{ fontSize: "12px", color: "#777" }}>
          No Results
        </Typography>
      </div>
    </Card>
  );
}
