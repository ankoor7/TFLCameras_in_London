class CreateCameras < ActiveRecord::Migration
  def change
    create_table :cameras do |t|
      t.boolean :available
      t.string :file
      t.string :lat
      t.string :lng
      t.string :postcode
      t.string :location

      t.timestamps
    end
  end
end
