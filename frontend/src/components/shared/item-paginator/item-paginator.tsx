import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import classes from "./item-paginator.module.css";

type ItemPaginatorProps = {
  items: React.ReactNode[];
  gap?: number;
  width?: number;
  className?: string;
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 2300 },
    items: 15,
  },
  desktop: {
    breakpoint: { max: 2300, min: 1024 },
    items: 10,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const Root = ({ items, className }: ItemPaginatorProps) => {
  return (
    <div className={`${classes.root} ${className || ""}`}>
      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        removeArrowOnDeviceType={[
          "tablet",
          "mobile",
          "desktop",
          "superLargeDesktop",
        ]}
        className={classes.carousel}
      >
        {items.map((item, index) => (
          <div key={index} className={classes.item}>
            {item}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export const ItemPaginator = {
  Root,
};
