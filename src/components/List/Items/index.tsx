import React from 'react';

interface ItemProps {
  name: string;
}

const Item = ({ name }: ItemProps) => {
  return (
    <div>{name}</div>
  );
}

export default Item;
