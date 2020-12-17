import { TvShowsState } from './tvShows';
import { ServerState } from './servers';
import { PageState } from './page';
import { SnackbarState } from './snackbar';
import { UserState } from './user';
import { UserViewsState } from './userViews';
import { HomeSectionState } from './homeSection';

export interface AppState {
  tvShows: TvShowsState;
  page: PageState;
  servers: ServerState;
  snackBar: SnackbarState;
  user: UserState;
  userViews: UserViewsState;
  homeSection: HomeSectionState;
}
