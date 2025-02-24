import { Page } from "@Components/onsenui/Page";
import { Toolbar } from "@Components/onsenui/Toolbar";
import { useActivity } from "@Hooks/useActivity";
import { useStrings } from "@Hooks/useStrings";
import { useTheme } from "@Hooks/useTheme";

import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import { useSettings } from "@Hooks/useSettings";
import { Shell } from "@Native/Shell";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import { ListSubheader, SxProps } from "@mui/material";
import React from "react";
import { BuildConfig } from "@Native/BuildConfig";
import { useFormatDate } from "@Hooks/useFormatDate";

const checkRoot = (): string | undefined => {
  if (Shell.isMagiskSU()) {
    return "assets/MagiskSULogo.png";
  } else if (Shell.isKernelSU()) {
    return "assets/KernelSULogo.png";
  } else if (Shell.isAPatchSU()) {
    return "assets/APatchSULogo.png";
  } else {
    return undefined;
  }
};

const AboutActivity = () => {
  const { strings } = useStrings();
  const { settings } = useSettings();
  const { theme } = useTheme();
  const { context, extra } = useActivity();

  const renderToolbar = () => {
    return (
      <Toolbar modifier="noshadow">
        <Toolbar.Left>
          <Toolbar.BackButton onClick={context.popPage} />
        </Toolbar.Left>
        <Toolbar.Center>About</Toolbar.Center>
      </Toolbar>
    );
  };

  const date = useFormatDate(BuildConfig.BUILD_DATE);

  type ListRender = {
    title: string;
    content: Array<{ primary: string; secondary: string | number }>;
  };

  const list = React.useMemo<ListRender[]>(
    () => [
      {
        title: "App",
        content: [
          { primary: "Name", secondary: BuildConfig.APPLICATION_ID },
          { primary: "Version", secondary: `v${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})` },
          { primary: "Build date", secondary: date },
          { primary: "Build type", secondary: BuildConfig.BUILD_TYPE },
        ],
      },
      {
        title: "Root",
        content: [
          { primary: "Root manager", secondary: Shell.getRootManager() },
          { primary: "Root version", secondary: `${Shell.VERSION_NAME().replace(/(.+):(.+)/gim, "$1")} (${Shell.VERSION_CODE()})` },
        ],
      },
      {
        title: "User",
        content: [
          { primary: "Name", secondary: Shell.pw_name() },
          { primary: "User ID", secondary: Shell.pw_uid() },
          { primary: "Group ID", secondary: Shell.pw_gid() },
        ],
      },
    ],
    []
  );

  return (
    <Page renderToolbar={renderToolbar}>
      <Page.RelativeContent zeroMargin>
        <Stack sx={{ mt: 1 }} direction="column" justifyContent="flex-start" alignItems="center" spacing={1}>
          <Badge
            sx={{ height: 100, width: 100 }}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={(theme) => ({
                  width: 40,
                  height: 40,
                  borderRadius: "unset",
                  bgcolor: "transparent",
                })}
                src={checkRoot()}
              >
                
              </Avatar>
            }
          >
            <Avatar sx={{ height: 100, width: 100, bgcolor: "#4a148c" }}>
              <CodeRoundedIcon sx={{ color: "white", height: 67, width: 67 }} />
            </Avatar>
          </Badge>

          <Typography
            variant="h3"
            noWrap
            color={settings.darkmode ? "text.primary" : undefined}
            sx={{
              display: "flex",
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
          >
            MMRL
          </Typography>

          {list.map((l) => (
            <List
              sx={{ width: "100%", bgcolor: "background.paper" }}
              subheader={l.title ? <ListSubheader>{l.title}</ListSubheader> : undefined}
            >
              {l.content.map((c) => (
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Typography sx={{ display: "inline" }} color={settings.darkmode ? "text.primary" : undefined} component="span">
                            {c.primary}
                          </Typography>
                          <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                            {c.secondary}
                          </Typography>
                        </Stack>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ))}
        </Stack>
      </Page.RelativeContent>
    </Page>
  );
};

export default AboutActivity;
