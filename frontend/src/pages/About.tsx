import styled from 'styled-components';
import SEO from '../components/SEO';

const PageWrapper = styled.div`
  background-color: var(--color-background);
  min-height: 80vh;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const About = () => {
  return (
    <PageWrapper>
      <SEO 
        title="About Us | Collect & Cruise"
        description="Learn more about Collect & Cruise, your premier destination for hot wheels collectors india."
        keywords="hot wheels collectors india, about collect and cruise, diecast cars"
      />
      <ContentContainer>
        <Title>About Collect & Cruise</Title>
        <Text>
          Welcome to Collect & Cruise, your premier destination for diecast model cars in India.
        </Text>
        <Text>
          We are passionate about bringing the best models to hot wheels collectors india and 
          enthusiasts across the country. Whether you're hunting for a rare Treasure Hunt or 
          starting your first collection, we have something for everyone.
        </Text>
      </ContentContainer>
    </PageWrapper>
  );
};

export default About;
