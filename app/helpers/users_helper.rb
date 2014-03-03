module UsersHelper

  def status(treatment)
    if (treatment.tprog == 'Стандарт - Дети')
      if ((treatment.tdate..treatment.tph2_e).cover?(Date.today))
        if ((treatment.tph1_s..treatment.tph1_e).cover?(Date.today))
          status = "Фаза 1"
        elsif ((treatment.tph2_s..treatment.tph2_e).cover?(Date.today))
          status = "Фаза 2"
        else
          status = "Лечение приостановлено"
        end
      else
          status = "Лечение окончено"
      end
    else
      if ((treatment.tdate..treatment.tph2_e).cover?(Date.today))
        if ((treatment.tph0_s..treatment.tph0_e).cover?(Date.today))
          status = "Фаза 0"
        elsif ((treatment.tph1_s..treatment.tph1_e).cover?(Date.today))
          status = "Фаза 1"
        elsif ((treatment.tph2_s..treatment.tph2_e).cover?(Date.today))
          status = "Фаза 2"
        else
          status = "Лечение приостановлено"
        end
      else
         status = "Лечение окончено"
      end
    end

    return status
  end


  def wrap(content)
    sanitize(raw(content.split.map{ |s| wrap_long_string(s) }.join(' ')))
  end

  private

  def wrap_long_string(text, max_width = 30)
    zero_width_space = "&#8203;"
    regex = /.{1,#{max_width}}/
    (text.length < max_width) ? text :
        text.scan(regex).join(zero_width_space)
  end

end
