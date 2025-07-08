import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  runnerBox: {
    backgroundColor: "#E0F2F1",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 3,
    marginLeft: 6,
    minWidth: 84,
  },
  runnerInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  runnerIconCircle: {
    backgroundColor: "#B2DFDB",
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  runnerCountText: {
    fontSize: 17,
    color: "#009688",
    fontWeight: "bold",
  },
  runnerLabel: {
    fontSize: 13,
    color: "#009688",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
