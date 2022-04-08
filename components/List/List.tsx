import ListItemComponent from "./ListItem/ListItem";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  Tooltip,
} from "@mui/material";
import { IListProps } from "./models";

const ListComponent = (props: IListProps) => {
  const {
    items,
    labels,
    headerButtons,
    itemButtons,
    icon,
    getItemBody,
    headerItem,
    footerItem,
  } = props;
  const itemsKey = "olist-item-" + Math.random().toString(36).substring(2, 10);
  const renderItems = () => {
    return items.map((item, index) => (
      <ListItemComponent
        item={item}
        buttons={itemButtons}
        icon={icon}
        getItemBody={getItemBody}
        key={`${itemsKey}-${index}`}
        divider={true}
      />
    ));
  };

  const renderHeaderButtons = () => {
    if (headerButtons) {
      return headerButtons.map((item, index) => {
        return item.render ? (
          <div key={`item-headerBtn-${index}`}>{item.render}</div>
        ) : (
          <Tooltip key={`item-headerBtn-${index}`} title={item.tooltip || ""}>
            <IconButton color="primary" component="span" onClick={item.onClick}>
              {item.icon}
            </IconButton>
          </Tooltip>
        );
      });
    }
    return [];
  };

  const render = () => {
    return (
      <Grid sx={{ height: "100%" }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardHeader
            title={labels.headerTitle ? labels.headerTitle : "List"}
            sx={{ padding: 1, paddingBottom: 0 }}
            action={
              <Grid sx={{ paddingRight: (theme) => theme.spacing(1) }}>
                {renderHeaderButtons()}
              </Grid>
            }
          />
          <CardContent sx={{ padding: 1, paddingTop: 0 }}>
            <List sx={{ display: "block" }} dense={true}>
              {headerItem}
            </List>
            <List sx={{ display: "block", overflow: "auto" }} dense={true}>
              {renderItems()}
            </List>
            <List sx={{ display: "block" }} dense={true}>
              {footerItem}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return render();
};

export default ListComponent;
