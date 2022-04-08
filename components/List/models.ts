import React from "react";

export interface IItem {
  [key: string]: any;
}

export interface IListItemButton {
  label?: string;
  onClick?: (item: IItem | null) => unknown;
  icon?: React.ReactElement;
  hide?: boolean;
  tooltip?: string;
  render?: React.ReactElement;
}

export interface IListProps {
  items: IItem[];
  getItemBody: (item: IItem) => React.ReactElement;
  headerButtons?: IListItemButton[];
  itemButtons?: IListItemButton[];
  icon?: React.ReactElement;
  footerItem?: React.ReactElement;
  headerItem?: React.ReactElement;
  labels: {
    headerTitle?: string;
  };
}

export interface IListItemProps {
  item: IItem;
  buttons?: IListItemButton[];
  icon?: React.ReactElement;
  getItemBody: (item: IItem) => React.ReactElement;
  divider?: boolean;
  hideIcon?: boolean;
}
