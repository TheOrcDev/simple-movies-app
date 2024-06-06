import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./utils";
import App from "../App";

it("movies starred and saved to watch later", async () => {
  renderWithProviders(<App />);

  await userEvent.type(screen.getByTestId("search-movies"), "forrest gump");
  await waitFor(() => {
    expect(
      screen.getAllByText("Through the Eyes of Forrest Gump")[0]
    ).toBeInTheDocument();
  });
  const starMovieLink = screen.getAllByTestId("starred-link")[0];
  await waitFor(() => {
    expect(starMovieLink).toBeInTheDocument();
  });
  await userEvent.click(starMovieLink);
  await waitFor(() => {
    expect(screen.getByTestId("star-fill")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByTestId("unstar-link")).toBeInTheDocument();
  });

  const watchLaterLink = screen.getAllByTestId("watch-later")[0];
  await waitFor(() => {
    expect(watchLaterLink).toBeInTheDocument();
  });
  await userEvent.click(watchLaterLink);
  await waitFor(() => {
    expect(screen.getByTestId("remove-watch-later")).toBeInTheDocument();
  });

  await userEvent.click(screen.getAllByTestId("remove-watch-later")[0]);
});
