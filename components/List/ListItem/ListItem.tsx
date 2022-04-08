import { QuestionMark } from "@mui/icons-material";
import {
  Avatar,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { IListItemProps } from "../models";

const ListItemComponent = (props: IListItemProps) => {
  const { item, buttons, icon, getItemBody, divider, hideIcon } = props;
  const [keyMap] = useState(
    "oedtsubhlist_" + Math.random().toString(20).substring(2, 10)
  );

  const renderAvatarIcon = () => {
    const sxStyle = !!icon ? {} : { backgroundColor: "transparent" };
    return <Avatar sx={sxStyle}>{icon ? icon : <QuestionMark />}</Avatar>;
  };

  const renderButtons = () => {
    if (buttons) {
      return buttons.map((itemBtn, index) => {
        return itemBtn.render ? (
          <div key={`item-headerBtn-${keyMap}-${index}`}>{itemBtn.render}</div>
        ) : (
          <Tooltip
            key={`itemBtn-elementBtn-${keyMap}-${index}`}
            title={itemBtn.tooltip || ""}
          >
            <IconButton
              color="primary"
              disabled={!!itemBtn.hide}
              component="span"
              onClick={(evnt: any) => {
                evnt.stopPropagation();
                if (!!itemBtn.onClick) {
                  itemBtn.onClick(item);
                }
              }}
            >
              {!!itemBtn.hide ? <Icon /> : itemBtn.icon}
            </IconButton>
          </Tooltip>
        );
      });
    }
    return [];
  };
  const render = () => {
    return (
      <ListItem divider={divider}>
        {!hideIcon ? <ListItemAvatar>{renderAvatarIcon()}</ListItemAvatar> : []}
        <Grid sx={{ display: "flex", width: "100%" }}>{getItemBody(item)}</Grid>
        <Grid sx={{ marginLeft: "1rem", display: "contents" }}>
          {renderButtons()}
        </Grid>
      </ListItem>
    );
  };

  return render();
};

export default ListItemComponent;
