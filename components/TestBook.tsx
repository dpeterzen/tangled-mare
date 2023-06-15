import React, { useEffect, useState } from "react";
import { CardContent, Typography, CardMedia } from "@mui/material";

interface Progress {
  total: number;
  current: number;
}

interface Data {
  title: string;
  text_description?: string[];
  image_description?: string[];
  illustrations?: string[];
}

interface SSEData {
  status: string;
  progress: Progress;
  data: Data | null;
}

interface TestBookProps {
  taskId: string;
  setLoading: (loading: boolean) => void;
}

const TestBook: React.FC<TestBookProps> = ({ taskId, setLoading }) => {
  const [sseData, setSSEData] = useState<SSEData | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}get_updates/${taskId}`);

    eventSource.onmessage = (event) => {
      if (event.data.startsWith(':')) {
        // Ignore keep-alive messages
        return;
      }

      try {
        const parsedData: SSEData = JSON.parse(event.data);
        console.log(parsedData); // log the parsed data
        setSSEData(parsedData);

        // Check if status is done and close the connection
        if (parsedData.status === 'done') {
          setLoading(false);
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      // Handle the error here, you may want to add some retry logic
      console.error("SSE error:", error);
      // Close the connection in case of error
      eventSource.close();
    };

    return () => {
      // It's important to close the connection when the component is unmounted
      eventSource.close();
    };
  }, [taskId, setLoading]); // Rerun effect when taskId changes

  if (!sseData) {
    return <div>Loading...</div>;
  }

  const { data } = sseData;
  const maxLength = Math.max(
    data?.text_description?.length || 0,
    data?.image_description?.length || 0,
    data?.illustrations?.length || 0
  );

  return (
    <div className="flex flex-col justify-center items-center">


      {data && (
        <>
          <div className="my-1">
            <div className="flex justify-between items-center pb-2 border-b border-gray-300">
              <h2 className="text-xl font-bold">
                Your Generated Storybook
              </h2>
            </div>
            <div className="max-w-2xl my-4 mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-4 border">
                <CardContent>
                  <h3 className="text-xl text-center font-bold">{data.title}</h3>
                </CardContent>
                {[...Array(maxLength)].map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="mt-2 mb-1 text-center text-sm text-gray-600">
                      {`Page ${index + 1}`}
                    </div>
                    {data.text_description && data.text_description[index] && (
                      <CardContent>
                        <Typography variant="body1">
                          {data.text_description[index]}
                        </Typography>
                      </CardContent>
                    )}
                    {data.illustrations && data.illustrations[index] && (
                      <>
                        <CardMedia
                          component="img"
                          height="140"
                          image={data.illustrations[index]}
                          alt="Illustration"
                        />
                        {data.image_description && data.image_description[index] && (
                          <p className="mb-4 text-xs text-center text-gray-500">
                            {data.image_description[index]}
                          </p>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}

                {sseData.status === 'done' && (
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }}>
                      The End
                    </Typography>
                  </CardContent>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );


};

export default TestBook;
