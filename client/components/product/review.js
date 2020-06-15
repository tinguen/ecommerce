import React from 'react'

const Review = (props) => {
  const { review } = props
  const baseUrl = window.location.origin
  return (
    <div>
      <div className={`${review.description ? 'block' : 'hidden'} relative card card-margin`}>
        <div className="absolute top-0 right-0 flex items-center">
          <div>{review.stars}</div>
          <img
            alt="Star img"
            src={`${baseUrl}/images/star.png`}
            className="w-4 h-4 object-cover inline-block ml-2 mr-2"
          />
        </div>
        <div>
          <div className="font-bold">
            {review.firstName} {review.lastName} wrote:
          </div>
          <div className="overflow-auto">{review.description}</div>
        </div>
      </div>
      <div className={`${review.description ? 'hidden' : 'block'} card card-margin`}>
        <div>
          <div className="relative font-bold">
            {review.firstName} {review.lastName} left {review.stars}
            <img
              alt="Star img"
              src={`${baseUrl}/images/star.png`}
              className="w-4 h-4 object-cover inline-block ml-2 mr-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Review.propTypes = {}

export default Review
