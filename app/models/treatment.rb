class Treatment < ActiveRecord::Base
  belongs_to :user
  has_many :schedules, dependent: :destroy
  has_one :notification, dependent: :destroy

  accepts_nested_attributes_for :schedules
  accepts_nested_attributes_for :notification

  default_scope -> { order('created_at DESC') }

  #validates :user_id, presence: true
  validates :dname, presence: true, length: { maximum: 50 }
  validates :dsurname, presence: true, length: { maximum: 50 }
  validates :dclinic, presence: true, length: { maximum: 50 }
  validates :tprog, presence: true
  validates :tdate, presence: true

  before_save do

    case self.tprog
      when "Стандарт - Дети"

        self.tph0_s = self.tdate
        self.tph0_e = self.tdate
        self.tph1_s = self.tdate
        self.tph1_e = self.tdate + 2.months + 1.day
        self.tph2_s = self.tdate + 2.months + 2.days
        self.tph2_e = self.tdate + 4.months + 2.days

      else

        self.tph0_s = self.tdate
        self.tph0_e = self.tdate + 1.month
        self.tph1_s = self.tdate + 1.month + 1.day
        self.tph1_e = self.tdate + 3.months + 1.day
        self.tph2_s = self.tdate + 3.months + 2.days
        self.tph2_e = self.tdate + 5.months + 2.days

    end

  end

  after_save do

    tph0_counter = 0;
    #tph1_counter = 0;
    tph2_counter = 0;
    ttot_counter = self.tph0_s;
    #self.build_schedule;

    Schedule.where(treatment_id: self.id).delete_all

    until ttot_counter > self.tph2_e
      if (ttot_counter >= self.tph0_s && ttot_counter <= self.tph0_e)
        case self.tprog
          when "Стандарт - Взрослые"
            #Schedule.where(treatment_id: self.id).first_or_create do |sch|
            Schedule.create!(d: ttot_counter, ps:[5+tph0_counter,20].min, psr: 2,  s1:0, s1r: 0, s2:0, s2r: 0, ss:1, ssr: 2, treatment_id:self.id )
          when "Стандарт - Дети"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:20, s1r: 2, s2:0, s2r: 0, ss:1, ssr: 1, treatment_id:self.id )
          when "Аллергия - Взрослые"
            Schedule.create!(d: ttot_counter, ps:[5+tph0_counter,20].min, psr: 2, s1:0, s1r: 0, s2:0, s2r: 0, ss:1, ssr: 2, treatment_id:self.id )
          when "Аллергия - Дети"
            Schedule.create!(d: ttot_counter, ps:[5+tph0_counter,10].min, psr: 2, s1:0, s1r: 0, s2:0, s2r: 0, ss:1, ssr: 1, treatment_id:self.id )
          else
        end
        tph0_counter += 1

      elsif (ttot_counter >= self.tph1_s && ttot_counter <= self.tph1_e)
        case self.tprog
          when "Стандарт - Взрослые"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:30, s1r: 2, s2:0, s2r: 0, ss:1, ssr: 2, treatment_id:self.id )
          when "Стандарт - Дети"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:20, s1r: 2, s2:0, s2r: 0, ss:1, ssr: 1, treatment_id:self.id )
          when "Аллергия - Взрослые"
            Schedule.create!(d: ttot_counter, ps:20, psr: 1, s1:20, s1r: 2, s2:0, s2r: 0, ss:1, ssr: 2, treatment_id:self.id )
          when "Аллергия - Дети"
            Schedule.create!(d: ttot_counter, ps:10, psr: 1, s1:20, s1r: 2, s2:0, s2r: 0, ss:1, ssr: 1, treatment_id:self.id )
          else
        end
        #tph1_counter += 1

      elsif (ttot_counter >= self.tph2_s && ttot_counter <= self.tph2_e)
        case self.tprog
          when "Стандарт - Взрослые"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:30, s1r: 2, s2:[5+tph2_counter,20].min, s2r: 2, ss:1, ssr: 2, treatment_id:self.id )
          when "Стандарт - Дети"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:20, s1r: 2, s2:10, s2r: 1, ss:1, ssr: 1, treatment_id:self.id )
          when "Аллергия - Взрослые"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:20, s1r: 2, s2:[5+tph2_counter,20].min, ss:1, s2r: 2, ssr: 2, treatment_id:self.id )
          when "Аллергия - Дети"
            Schedule.create!(d: ttot_counter, ps:0, psr: 0, s1:20, s1r: 2, s2:10, s2r: 1, ss:1, ssr: 1, treatment_id:self.id )
          else
        end
        tph2_counter += 1

      else

      end

      ttot_counter = ttot_counter + 1.day

    end

  end

end
