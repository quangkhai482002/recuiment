import React from "react";
import "./NotFound.scss";
import { Button } from "antd";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notFound">
      <div className="card-front">
        <Link to={`/${localStorage.getItem('currentRole') ? localStorage.getItem('currentRole') : ''}`}>
          <Button>GO BACK HOME</Button>
        </Link>
      </div>
    </div>
  );
}
