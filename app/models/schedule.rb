class Schedule < ActiveRecord::Base
  belongs_to :treatment

  validates :treatment_id, presence: true
  validates :d, presence: true
  validates :ps, presence: true
  validates :s1, presence: true
  validates :s2, presence: true
  validates :ss, presence: true

end
