import React, { useEffect, useState } from "react";
import { CardContent, Typography, CardMedia } from "@mui/material";
import Placeholder from '@mui/material/Skeleton';

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
  const [isImageLoaded, setImageLoaded] = useState<boolean[]>([]); 

  useEffect(() => {

    // Reset the isImageLoaded state when opening a new SSE connection
    setImageLoaded([]);
    
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}get_updates/${taskId}`);

    eventSource.onmessage = (event) => {
      if (event.data.startsWith(':')) {
        return;
      }

      try {
        const parsedData: SSEData = JSON.parse(event.data);
        console.log(parsedData);
        setSSEData(parsedData);

        if (parsedData.status === 'done') {
          setLoading(false);
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId, setLoading]); 

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
                Your Generated Picturebook
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
                    {data.image_description && data.image_description[index] && (
                      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                        {data.illustrations && data.illustrations[index] && (
                          <CardMedia
                            component="img"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: isImageLoaded[index] ? 'block' : 'none'
                            }}
                            image={data.illustrations[index]}
                            alt={data.image_description[index]}
                            title={data.image_description[index]}
                            onLoad={() => {
                              setImageLoaded(prevState => {
                                const newState = [...prevState];
                                newState[index] = true;
                                return newState;
                              });
                            }}
                          />
                        )}
                        {!isImageLoaded[index] && (
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Placeholder variant="rectangular" width="100%" height="100%" animation="wave" />
                            <p className="mx-20 text-xs text-center text-gray-500" style={{ position: 'absolute' }}>
                              {data.image_description[index]}
                            </p>
                          </div>
                        )}
                      </div>
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
