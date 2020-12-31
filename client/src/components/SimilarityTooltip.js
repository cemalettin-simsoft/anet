import { Icon, Intent, Popover } from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import LinkTo from "components/LinkTo"
import levenshtein from "js-levenshtein"
import PropTypes from "prop-types"
import React from "react"
import { Button } from "react-bootstrap"

const SimilarityTooltip = ({
  entityArray,
  strToMatch,
  entityType,
  getStringFromEntity
}) => {
  const entitiesSortedForSimilarity =
    strToMatch?.length > 6
      ? entityArray
        .sort((a, b) => {
          return (
            levenshtein(getStringFromEntity(a), strToMatch) -
              levenshtein(getStringFromEntity(b), strToMatch)
          )
        })
        .slice(0, 10)
      : []

  if (entitiesSortedForSimilarity.length < 1) {
    return null
  }

  return (
    <>
      <Popover
        content={
          <div>
            {entitiesSortedForSimilarity.map(entity => (
              <div key={entity.uuid}>
                <LinkTo modelType={entityType} model={entity} />
              </div>
            ))}
          </div>
        }
        intent={Intent.WARNING}
        popoverClassName="similarity-popover"
      >
        <Button>
          <Icon
            icon={IconNames.WARNING_SIGN}
            intent={Intent.WARNING}
            iconSize={Icon.SIZE_STANDARD}
            style={{ margin: "0 6px" }}
          />
          Possibly duplicates
        </Button>
      </Popover>
    </>
  )
}
SimilarityTooltip.propTypes = {
  entityArray: PropTypes.array.isRequired,
  strToMatch: PropTypes.string.isRequired,
  entityType: PropTypes.string.isRequired,
  getStringFromEntity: PropTypes.func.isRequired
}
export default SimilarityTooltip
