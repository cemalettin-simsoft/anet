import LinkAnetEntity from "components/editor/LinkAnetEntity"
import parse from "html-react-parser"
import PropTypes from "prop-types"
import React from "react"
import { getEntityInfoFromUrl } from "utils_links"

// Enhanced HTML so that links will be converted to link components
export function parseHtmlWithLinkTo(html, linkToComp) {
  if (!html) {
    return null
  }
  return parse(html, {
    replace: domNode => {
      if (domNode.attribs && domNode.attribs.href) {
        return <LinkAnet url={domNode.attribs.href} linkToComp={linkToComp} />
      }
    }
  })
}

const LinkAnet = ({ entityKey, contentState, url, linkToComp }) => {
  const urlLink =
    url || (contentState && contentState.getEntity(entityKey).getData().url)

  const isAnetEntityLink = getEntityInfoFromUrl(urlLink)

  if (isAnetEntityLink) {
    return (
      <LinkAnetEntity
        type={isAnetEntityLink.type}
        uuid={isAnetEntityLink.uuid}
        linkToComp={linkToComp}
      />
    )
  } else {
    // Non ANET entity link
    return <>{urlLink}</>
  }
}

LinkAnet.propTypes = {
  entityKey: PropTypes.string,
  contentState: PropTypes.object,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  children: PropTypes.any,
  url: PropTypes.string
}

export default LinkAnet
