import React from 'react';
import { useRouteMatch } from "react-router-dom";
import Packs from './Packs';
import PackEditor from './PackEditor';

const PacksRoute: React.FC = () => {
  const match = useRouteMatch("/packs/:id");
  if (match && match.params && match.params.id) {
    return <PackEditor id={match.params.id} />
  } else {
    return <Packs />
  }
}

export default PacksRoute;