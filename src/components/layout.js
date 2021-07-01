import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Container, Row, Col } from "react-bootstrap";
import Header from './header'
import './layout.css'

const Layout = ({ children,pageInfo }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'csound' },
            { name: 'keywords', content: 'csound' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <Container fluid="false">
        <Row><Col></Col><Col md="auto">
           <Row>
             <Header siteTitle={data.site.siteMetadata.title} />
           </Row>
           <Row className="justify-content-md-center">
          {children}
           </Row>
           </Col>
           <Col></Col>
        </Row>
        </Container>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
