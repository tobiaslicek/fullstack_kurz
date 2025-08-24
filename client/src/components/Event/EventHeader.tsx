import React from "react";

type Props = {
  title: string;
  location?: string;
};

const EventHeader: React.FC<Props> = ({ title, location }) => (
  <div>
    <h2>{title}</h2>
    {location && <p><strong>Místo:</strong> {location}</p>}
  </div>
);

export default EventHeader;
