require "json"
require 'net/http'
require 'open-uri'
require 'pp'


content = JSON.parse(open("https://api.github.com/repos/mbostock/d3/stats/commit_activity").read)
pp content

def sort_by_commit(array)
  array.sort_by { |week| week["total"] }
end

def most_committed_week_number(array)
  array.index(sort_by_commit(array).last) + 1
end

def highest_commit_by_day_array(array)
  array.map.with_index{ |week, index| {number_of_commits: week["days"].sort.last, week: index+1, day: week["days"].index(week["days"].sort.last)+1 } }
end

def most_committed_day_total(array)
  highest_commit_by_day_array(array).sort_by{ |info_hash| info_hash[:number_of_commits] }.last
end

def most_committed_day(array)
  week_arr = [0,0,0,0,0,0,0]
  week_strings = %w(Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
  array.each {|week| week["days"].each_with_index{|day,index| week_arr[index]+=day} }
  Hash[week_strings.zip(week_arr)].sort_by{|key, val| val }
end

def json_to_export(array)
  hash = {graph_data: [], top_commit_week: most_committed_week_number(array),  top_commit_day: most_committed_day(array).last}
  most_committed_day(array).each do |day|
    hash[:graph_data] << { letter: day.first.gsub(",", ""),  frequency: day.last }
  end
  hash
end

def export_json(array)
  val = json_to_export(array)
  File.write("public/graph_data.json", val.to_json)
end

export_json(content)

# p "Number of hashes from api repsonse. Should be 52 / true"
# p content.length
# p content.length == 52
# p "="*20
# p "Week number with most commits"
# p most_committed_week_number(content)
# p "="*20
# p "Day number with most commits"
# p most_committed_day_total(content)
# p "="*20
# p "Day in each week with most commits"
# v = most_committed_day(content).last
# day = v.first
# num_coms = v.last
# p "#{day} with #{num_coms} commits"
# p "="*20