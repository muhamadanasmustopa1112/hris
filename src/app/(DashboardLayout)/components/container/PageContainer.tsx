import { Typography, Box } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PageContainer = ({ title, description, children }: Props) => {
  
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>

        {/* Display the title and description on the page */}
        {description && (
          <Box mb={4}> 
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {description}
            </Typography>
          </Box>
        )}

        {/* Render children */}
        {children}
      </div>
    </HelmetProvider>
  );
};

export default PageContainer;
