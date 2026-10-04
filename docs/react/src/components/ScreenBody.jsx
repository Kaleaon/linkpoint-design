import { useApp } from "../context/AppContext.jsx";
import { useThemeRuntime } from "../context/ThemeContext.jsx";
import { LAYOUTS } from "../theme/layouts.js";
import { PALETTES } from "../theme/palettes.js";
import { buildCards } from "../data/content.js";
import { subView, inSub } from "../theme/constants.js";
import Header from "./Header.jsx";
import SegmentedTabs from "./SegmentedTabs.jsx";
import ChipRow from "./ChipRow.jsx";
import StateBlock, { GlobalErrorBoundary } from "./StateBlock.jsx";
import CardList from "./CardList.jsx";
import SplitDetail from "./SplitDetail.jsx";
import { SkeletonCardList } from "./Skeletons.jsx";
import Chat from "../screens/Chat.jsx";
import Radar from "../screens/Radar.jsx";
import Map from "../screens/Map.jsx";
import World3D, { World3DActionBar } from "../screens/World3D.jsx";
import Inventory from "../screens/Inventory.jsx";
import Profile from "../screens/Profile.jsx";
import Login from "../screens/Login.jsx";
import Search from "../screens/Search.jsx";
import OfflineGrid from "../screens/OfflineGrid.jsx";
import GridConsole from "../screens/GridConsole.jsx";
import Outfits from "../screens/Outfits.jsx";
import Parcel from "../screens/Parcel.jsx";
import Objects from "../screens/Objects.jsx";
import Transactions from "../screens/Transactions.jsx";
import MuteList from "../screens/MuteList.jsx";
import Teleport from "../screens/Teleport.jsx";
import Friends from "../screens/Friends.jsx";
import Groups from "../screens/Groups.jsx";
import Notices from "../screens/Notices.jsx";
import Settings from "../screens/Settings.jsx";
import Cache from "../screens/Cache.jsx";
import Diagnostics from "../screens/Diagnostics.jsx";

const CARD_SCREENS = [];

// Ported from the big content column inside `shellStyle` (headers -> segTabs
// -> chips -> the 13 screens' bodies), plus the split-view detail pane that
// sits beside it on tablet/foldable devices.
export default function ScreenBody() {
  const { state, actions } = useApp();
  const { norm, scr } = useThemeRuntime();

  const isLoading = state?.cond === "loading";
  const cardsByScreen = buildCards({ state, actions, layoutName: LAYOUTS[state.layout].name, paletteName: PALETTES[state.palette].name });
  const isCardScreen = CARD_SCREENS.includes(scr);
  const curSub = subView(state, scr);

  const customLoadingScreen = [
    "Inventory", "Search", "Outfits", "Parcel", "Objects", "Transactions",
    "Mute List", "Teleport", "Friends", "Groups", "Notices", "Settings",
    "Cache", "Diagnostics"
  ].includes(scr);

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: "400px", display: "flex", position: "relative" }}>
      <main aria-label="Main Content" style={{ flex: 1, minWidth: 0, minHeight: "400px", display: "flex", flexDirection: "column" }}>
        <Header />
        <SegmentedTabs />
        <ChipRow />
        <GlobalErrorBoundary onReset={() => actions.setCond && actions.setCond("normal")}>
          {isLoading && !customLoadingScreen && scr !== "Login" && <SkeletonCardList style={{ minHeight: "320px" }} />}
          {!isLoading && norm && scr === "Chat" && <Chat />}
          {!isLoading && norm && scr === "Radar" && <Radar />}
          {!isLoading && norm && scr === "Map" && <Map />}
          {!isLoading && norm && scr === "3D View" && (
            <>
              <World3D />
              <World3DActionBar />
            </>
          )}
          {norm && scr === "Inventory" && <Inventory />}
          {!isLoading && norm && scr === "Profile" && <Profile />}
          {!isLoading && norm && scr === "Outfits" && <Outfits />}
          {!isLoading && norm && scr === "Parcel" && <Parcel />}
          {!isLoading && norm && scr === "Objects" && <Objects />}
          {!isLoading && norm && scr === "Transactions" && <Transactions />}
          {!isLoading && norm && scr === "Mute List" && <MuteList />}
          {!isLoading && norm && scr === "Teleport" && <Teleport />}
          {!isLoading && norm && scr === "Friends" && <Friends />}
          {!isLoading && norm && scr === "Groups" && <Groups />}
          {!isLoading && norm && scr === "Notices" && <Notices />}
          {!isLoading && norm && scr === "Settings" && <Settings />}
          {!isLoading && norm && scr === "Cache" && <Cache />}
          {!isLoading && norm && scr === "Diagnostics" && <Diagnostics />}
          {!isLoading && norm && scr === "Offline Grid" && <OfflineGrid />}
          {!isLoading && norm && scr === "Grid Console" && <GridConsole />}
          {norm && isCardScreen && <CardList cards={(cardsByScreen[scr] || []).filter((c) => inSub(c, curSub))} />}
          {scr === "Login" && <Login />}
          {scr === "Search" && <Search />}
          {!norm && <StateBlock />}
        </GlobalErrorBoundary>
      </main>
      <SplitDetail />
    </div>
  );
}
